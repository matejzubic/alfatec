import mongoose from 'mongoose'

const souvenirSchema = new mongoose.Schema({
  id: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Name of souvenir is required.']
  },
  barCode: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /aaa-\w{3}/.test(v);
      },
      message: props => `${props.value} is not a valid bar code!`
    },
    required: [true, 'Souvenir bar code is required.']
  },
  color: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    trim: true,
    min: [0, "Quantity can't be negative."],
    required: [true, 'Souvenir quantity is required.']
  },
  productImageUrl: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  }
});

export default mongoose.model('Souvenir', souvenirSchema);