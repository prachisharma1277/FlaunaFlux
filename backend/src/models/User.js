const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    // New field to store Google's unique user ID
    googleId: {
      type: String,
      unique: true,
      // 'sparse' allows multiple documents to have a null value
      // This is crucial so non-Google users don't cause a unique index error
      sparse: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      // We'll get this from their Google profile
      type: String, 
    },
    password: {
      type: String,
      // --- MODIFICATION ---
      // Password is no longer required if they have a googleId
      required: function () {
        return !this.googleId;
      },
    },
    role: {
      type: String,
      enum: ['general', 'authorised',"admin"],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

// --- Mongoose Middleware (Modified) ---
UserSchema.pre('save', async function (next) {
  // --- MODIFICATION ---
  // Only hash the password if it's being modified AND it exists
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// (The 'matchPassword' method can stay the same)
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // If a Google user tries to use the password form, this will safely fail
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);