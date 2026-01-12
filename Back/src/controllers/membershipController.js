require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get all membership types
exports.getAll = async (req, res) => {
  try {
    const { data: memberships, error } = await supabase
      .from('membership_types')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;

    res.json(memberships || []);
  } catch (error) {
    console.error('Get memberships error:', error);
    res.status(500).json({ error: 'Failed to get membership types' });
  }
};

// Get single membership type
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: membership, error } = await supabase
      .from('membership_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Membership type not found' });
    }

    res.json(membership);
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({ error: 'Failed to get membership type' });
  }
};

// Create membership type
exports.create = async (req, res) => {
  try {
    const membership = req.body;

    const { data, error } = await supabase
      .from('membership_types')
      .insert([membership])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create membership error:', error);
    res.status(500).json({ error: 'Failed to create membership type' });
  }
};

// Update membership type
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('membership_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ error: 'Failed to update membership type' });
  }
};

// Delete membership type
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('membership_types')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Membership type deleted successfully' });
  } catch (error) {
    console.error('Delete membership error:', error);
    res.status(500).json({ error: 'Failed to delete membership type' });
  }
};