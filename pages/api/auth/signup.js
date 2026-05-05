import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all fields' })
  }

  try {
    await dbConnect()

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // 3. Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // 4. Return success (do not send the password back)
    res.status(201).json({
      message: 'User created successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
