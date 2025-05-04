const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    },
    firstName: { 
      type: String, 
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: { 
      type: String, 
      required: [true, 'Last name is required'],
      trim: true
    },
    phone: { 
      type: String, 
      required: [true, 'Phone number is required'],
      trim: true
    },
    address: { 
      type: String, 
      required: [true, 'Address is required'],
      trim: true
    },
    bloodType: { 
      type: String, 
      required: [true, 'Blood type is required'],
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood type'
      }
    },
    birthday: { 
      type: Date, 
      required: [true, 'Birthday is required']
    },
    sex: { 
      type: String, 
      required: [true, 'Sex is required'],
      enum: {
        values: ["male", "female"],
        message: '{VALUE} is not a valid gender'
      }
    },
    subjects: [{ 
      type: String,
      trim: true
    }],
    photoUrl: { 
      type: String
    },
    teacherId: { 
      type: String,
      unique: true,
      sparse: true
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      },
      versionKey: false
    }
  }
);

// Generate teacher ID and clean up subjects before saving
teacherSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      // Find the highest existing teacherId number for the current year
      const currentYear = new Date().getFullYear().toString().substr(-2);
      const prefix = `IT${currentYear}`;
      
      const highestTeacher = await this.constructor.findOne({
        teacherId: new RegExp(`^${prefix}`)
      }).sort({ teacherId: -1 });

      let nextNumber = 1;
      if (highestTeacher && highestTeacher.teacherId) {
        const currentNumber = parseInt(highestTeacher.teacherId.slice(-3));
        nextNumber = currentNumber + 1;
      }

      // Generate new teacherId with padded number
      this.teacherId = `${prefix}${String(nextNumber).padStart(3, '0')}`;
    }

    if (this.subjects) {
      this.subjects = this.subjects.filter(subject => subject && subject.trim().length > 0);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Handle duplicate key errors
teacherSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    next(new Error(`${field} already exists`));
  } else {
    next();
  }
});

module.exports = mongoose.model("Teacher", teacherSchema);
