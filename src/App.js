import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router'
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import AuthMenu from './Components/AuthMenu/AuthMenu'
import AddOrder from './Pages/AddOrder/AddOrder'
import Admin from './Pages/Admin/Admin'
import Calculator from './Pages/Calculator/Calculator'
import Home from './Pages/Home/Home'
import Login from './Pages/Login/Login'
import MyOrders from './Pages/MyOrders/MyOrders'
import MyProfile from './Pages/MyProfile/MyProfile'
import Payment from './Pages/Payment/Payment'
import Registration from './Pages/Registration/Registration'
import Welcome from './Pages/Welcome/Welcome'
import { fetchToken, loaded } from './Redux/slices/auth'
import Roster from './Pages/Roster/Roster'

function App() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { isAuth } = useSelector(state => state.auth)

	useEffect(() => {
		const token = localStorage.getItem('token')

		if (token) {
			dispatch(fetchToken({ token }))
		} else {
			dispatch(loaded())
			navigate('/welcome')
		}
	}, [])

	useEffect(() => {
		isAuth ? navigate('/home') : navigate('/welcome')
	}, [isAuth])

	return (
		<div className="App" data-body={true}>
			{isAuth ? <Header /> : <AuthMenu />}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/home" element={<Home />} />
				<Route path="/orders" element={<MyOrders />} />
				<Route path="/profile" element={<MyProfile />} />
				<Route path="/add-order" element={<AddOrder />} />
				<Route path="/edit/:id" element={<AddOrder />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/roster" element={<Roster />} />
				<Route path="/calculator" element={<Calculator />} />
				<Route path="/payment" element={<Payment />} />
				<Route path="/login" element={<Login />} />
				<Route path="/reg" element={<Registration />} />
				<Route path="/welcome" element={<Welcome />} />
				<Route path="*" element={<Home />} />
			</Routes>
			{isAuth && <Footer />}
		</div>
	)
}

export default App
