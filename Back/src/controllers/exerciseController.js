const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);


// Get all exercises
exports.getAll = async (req, res) => {
  try {
    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json(exercises || []);
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Failed to get exercises' });
  }
};

// Get single exercise
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: exercise, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ error: 'Failed to get exercise' });
  }
};

// Create exercise
exports.create = async (req, res) => {
  try {
    const exercise = req.body;

    const { data, error } = await supabase
      .from('exercises')
      .insert([exercise])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
};

// Update exercise
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({ error: 'Failed to update exercise' });
  }
};

// Delete exercise
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
};