import cls from './AuthMenu.module.css'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const menu = [
	{
		title: 'Главная',
		link: '/welcome',
	},
	{
		title: 'Войти',
		link: '/login',
	},
	{
		title: 'Зарегистрироваться',
		link: '/reg',
	},
]

const pages = ['/welcome', '/login', '/reg']

const Back = () => {
	const [active, setActive] = useState(0)
	const { isFirstRender } = useSelector(state => state.auth)
	const location = useLocation()

	if (!pages.includes(location.pathname) || isFirstRender) {
		return <></>
	}

	return (
		<div className={cls.wrapper}>
			<ul>
				{menu.map((el, i) => (
					<li key={i} className={active === i ? cls.active : ''} onClick={() => setActive(i)}>
						<Link to={el.link}>{el.title}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Back
