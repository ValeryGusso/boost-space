import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import cls from './Header.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../Redux/slices/auth'
import defaultAvatar from '../../assets/img/defAva.jpg'
import exit from '../../assets/img/logout.svg'
import { useEffect } from 'react'

const Header = () => {
	const dispath = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const [activePage, setActivePage] = useState(0)
	const me = useSelector(state => state.users.me)
	const avatar = useSelector(state => state.auth.avatar)
	const menuList = [
		{ title: 'Главная', link: '/home' },
		{ title: 'Админка', link: '/admin' },
		{ title: 'Добавить заказ', link: '/add-order' },
		{ title: 'Калькулятор', link: '/calculator' },
		{ title: 'Выплаты', link: '/payment' },
		{ title: 'Мои заказы', link: '/orders' },
		{ title: me?.name, link: '/profile' },
	]

	useEffect(() => {
		menuList.map((el, i) => {
			if (location.pathname === el.link) {
				setActivePage(i)
			} else if (location.pathname.includes('edit')) {
				setActivePage(2)
			}
		})
	}, [])

	function menuClick(num) {
		setActivePage(num)
	}

	const clickLogout = () => {
		dispath(logout())
		navigate('/welcome')
	}
	return (
		<div className={cls.header}>
			<div className={cls.menu}>
				<ul>
					{menuList.map((el, i) => {
						return !((i === 1 || i === 2 || i === 3) && !me?.isAdmin) ? (
							<li key={i} onClick={() => menuClick(i)} className={activePage === i ? cls.active : ''}>
								<Link to={el.link} data-text={el.title}> {el.title}</Link>
							</li>
						) : (
							''
						)
					})}
				</ul>
			</div>
			<div className={cls.profile}>
				<div className={cls.avatar}>
					<img src={avatar || defaultAvatar} alt="avatar" />
				</div>
				<img src={exit} alt="logout" onClick={clickLogout} title="Выйти" />
			</div>
		</div>
	)
}

export default Header
