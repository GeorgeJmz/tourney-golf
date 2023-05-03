import { action, makeObservable, observable } from 'mobx'
import { createUser } from '../../services/firebase'
import type { IUser } from '../../models/User'
import UserModel from '../../models/User'

class UserViewModel {
  user: UserModel = new UserModel()

  constructor () {
    makeObservable(this, {
      user: observable,
      setUser: action,
      createUser: action
    })
  }

  setUser (user: IUser): void {
    this.user = user
  }

  async createUser (user: IUser): Promise<void> {
    try {
      const createdUser = await createUser(user)
      this.setUser(createdUser)
    } catch (error) {
      console.log(error)
    }
  }
}

export default UserViewModel
