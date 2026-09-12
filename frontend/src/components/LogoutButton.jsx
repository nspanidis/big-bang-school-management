import { useNavigate } from 'react-router-dom'

function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')

    navigate('/', {
      replace: true,
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
    >
      Αποσύνδεση
    </button>
  )
}

export default LogoutButton