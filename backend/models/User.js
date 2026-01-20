import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // This creates an index, just like a UNIQUE constraint in SQL
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    const isBcryptHash = /^\$2[ayb]\$.{56}$/.test(this.password);

    if (isBcryptHash) {
        // Use bcrypt for hashed passwords
        return await bcrypt.compare(candidatePassword, this.password);
    } else {
        // Plain text comparison for old passwords
        return this.password === candidatePassword;
    }
};

// The first argument 'User' is the name of the collection (it will become 'users' in Atlas)
const User = mongoose.model('User', UserSchema);

export default User;