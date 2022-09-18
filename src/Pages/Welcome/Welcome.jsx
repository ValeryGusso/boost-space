import { Link } from 'react-router-dom'
import cls from './Welcome.module.css'
import steward from '../../assets/img/steward.png'

const Welcome = () => {
	return (
		<div className={cls.wrapper}>
			<div className={cls.text}>
				<p>Приветствую тебя на Boost space - официальном портале бустеров совятника</p>
			</div>
			<div className={cls.options}>
				<Link to="/login">У меня уже есть аккаунт</Link>
				<Link to="/reg">Зарегистрироваться</Link>
			</div>
			<img src={steward} alt="steward" style={{'--x': '5vmax'}}/>
			<img src={steward} alt="steward" style={{'--x': '70vmax'}}/>
		</div>
	)
}

export default Welcome
