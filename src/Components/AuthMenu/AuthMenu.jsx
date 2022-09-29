import cls from './AuthMenu.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

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

const Back = () => {
	const [active, setActive] = useState(0)

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
