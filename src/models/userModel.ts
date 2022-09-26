import {model, Model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
    name: string;
    email: string;
    password: string;
  }
  
  // Put all user instance methods in this interface:
  interface IUserMethods {
    validPassword: (password: string) => Promise<boolean>;
  }
  
  // Create a new Model type that knows about IUserMethods...
  type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
userSchema.methods.validPassword = async function (password:string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    
    bcrypt.genSalt(parseInt(process.env.SALTROUNDS || "10"), (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

const User = model<IUser, UserModel>('User', userSchema);

export default User;
