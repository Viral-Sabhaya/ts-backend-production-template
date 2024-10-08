import mongoose from 'mongoose'
import config from '../config/config'

export default {

  // DATA BASE Connection
  connect: async () => {
    try {
      await mongoose.connect(config.DATABASE_URL as string)
      return mongoose.connection
    } catch (error) {
      throw error
    }
  }
}