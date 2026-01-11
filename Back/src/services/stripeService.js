const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

class StorageService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  async uploadExerciseImage(file) {
    try {
      const fileExt = path.extname(file.originalname);
      const fileName = `exercise_${Date.now()}${fileExt}`;
      const filePath = `exercises/${fileName}`;

      // Read file buffer
      const fileBuffer = fs.readFileSync(file.path);

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('exercise-images')
        .upload(filePath, fileBuffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) {
        throw new Error(`Storage upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('exercise-images')
        .getPublicUrl(filePath);

      // Delete local file
      fs.unlinkSync(file.path);

      return publicUrl;
    } catch (error) {
      console.error('❌ Storage upload error:', error.message);
      
      // Clean up local file if it exists
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadUserAvatar(userId, file) {
    try {
      const fileExt = path.extname(file.originalname);
      const fileName = `avatar_${userId}_${Date.now()}${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const fileBuffer = fs.readFileSync(file.path);

      const { error } = await this.supabase.storage
        .from('user-avatars')
        .upload(filePath, fileBuffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = this.supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      fs.unlinkSync(file.path);

      return publicUrl;
    } catch (error) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  async deleteFile(bucket, filePath) {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ File deletion error:', error.message);
      return false;
    }
  }
}

module.exports = new StorageService();