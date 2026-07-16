import bcrypt from 'bcrypt'
class PassswordService {
  private saltRounds = 10

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds)
      return hashedPassword
    } catch (error) {
      console.error('Error hashing password:', error)
      throw new Error('Failed to hash password')
    }
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword)
    } catch (error) {
      console.error('Error comparing passwords:', error)
      throw new Error('Failed to compare passwords')
    }
  }
}

const bcryptpass = new PassswordService()
export default bcryptpass