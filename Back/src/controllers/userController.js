
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        membership_types:membership_type_id (name, description, features)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        membership_types:membership_type_id (name, description, features)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password_hash, ...userWithoutPassword } = data;
    
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Register user - UPDATED TO MATCH SCHEMA
exports.register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    
    // Extract ALL fields from schema
    const { 
      email, 
      password, 
      full_name, 
      phone, 
      gender,
      birth_date,
      height,
      weight,
      description,
      avatar_url,
      role,
      membership_type_id
    } = req.body;
    
    // Validate required fields
    if (!email || !password || !full_name) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["email", "password", "full_name"],
        received: req.body
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Determine membership type
    let finalMembershipId = membership_type_id;
    
    if (!finalMembershipId) {
      // Default to free membership
      const { data: membership, error: membershipError } = await supabase
        .from('membership_types')
        .select('id')
        .eq('name', 'free')
        .single();
      
      if (membershipError || !membership) {
        return res.status(500).json({ 
          error: 'Could not find free membership type. Please create membership types first.' 
        });
      }
      finalMembershipId = membership.id;
    }
    
    // Create user with ALL schema columns
    const userData = {
      email,
      password_hash: hashedPassword,
      full_name,
      phone: phone || null,
      gender: gender || null,
      birth_date: birth_date || null,
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
      description: description || null,
      avatar_url: avatar_url || null,
      role: role || 'user',  // Default to 'user' if not specified
      membership_type_id: finalMembershipId
    };
    
    console.log('Inserting user data:', userData);
    
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select(`
        id,
        full_name,
        email,
        phone,
        gender,
        birth_date,
        height,
        weight,
        description,
        avatar_url,
        role,
        membership_type_id,
        created_at,
        updated_at
      `)
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(400).json({ 
        error: "Failed to create user", 
        details: error.message,
        hint: error.hint || ''
      });
    }
    
    console.log('User created successfully:', data);
    
    res.status(201).json({
      message: "User registered successfully",
      user: data
    });
    
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      error: "Internal server error", 
      details: err.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // Find user with membership info
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        membership_types:membership_type_id (name, description, features)
      `)
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      message: "Login successful",
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update user - UPDATED TO MATCH SCHEMA
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log('Update request for user:', id);
    console.log('Update data:', updates);
    
    // If password is being updated, hash it
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    
    // Convert numeric fields
    if (updates.height) updates.height = parseFloat(updates.height);
    if (updates.weight) updates.weight = parseFloat(updates.weight);
    
    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select(`
        id,
        full_name,
        email,
        phone,
        gender,
        birth_date,
        height,
        weight,
        description,
        avatar_url,
        role,
        membership_type_id,
        created_at,
        updated_at
      `)
      .single();
    
    if (error) {
      console.error('Update error:', error);
      return res.status(404).json({ 
        error: 'User not found or update failed',
        details: error.message 
      });
    }
    
    res.json({
      message: "User updated successfully",
      user: data
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if user exists
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();
    
    if (findError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ 
      message: 'User deleted successfully',
      deletedUserId: id 
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get user profile (with related data)
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user with membership and stats
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        membership_types:membership_type_id (*),
        workouts:workouts(count),
        goals:goals(count),
        user_progress:user_progress(count)
      `)
      .eq('id', id)
      .single();
    
    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: err.message });
  }
};