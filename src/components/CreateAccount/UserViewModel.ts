import { action, makeObservable, observable } from 'mobx'
import { createUser } from '../../services/firebase'
import type { IUser } from '../../models/User'
import { Messages } from '../../helpers/messages'
import UserModel from '../../models/User'
import { toast } from 'react-toastify'
import { getMessage } from './helpers/getError'
import type { FirebaseError } from 'firebase/app'

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
    const displayLoading = getMessage(Messages.LOADING)
    const cuToast = toast.loading(displayLoading)
    try {
      const createdUser = await createUser(user)
      this.setUser(createdUser)
      const displayMessage = getMessage(Messages.USER_CREATED)
      toast.update(cuToast, { render: displayMessage, type: toast.TYPE.SUCCESS, isLoading: false, autoClose: 5000 })
    } catch (error) {
      const codeError = (error as FirebaseError).code
      const displayError = getMessage(codeError)
      toast.update(cuToast, { render: displayError, type: toast.TYPE.ERROR, isLoading: false, autoClose: 5000 })
    }
  }
}

export default UserViewModel
