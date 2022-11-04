import { Link } from 'react-router-dom'
import cls from './Welcome.module.css'
import steward from '../../assets/img/steward.png'
import { useSelector } from 'react-redux'
import Loader from '../../Components/Loader/Loader'

const Welcome = () => {
	const { isFirstRender } = useSelector(state => state.auth)
	return (
		<div className={cls.wrapper}>
			{isFirstRender ? (
				<Loader />
			) : (
				<>
					<div className={cls.text}>
						<p>Приветствую тебя на Boost space - официальном портале бустеров совятника</p>
					</div>
					<div className={cls.options}>
						<Link to="/login">У меня уже есть аккаунт</Link>
						<Link to="/reg">Зарегистрироваться</Link>
					</div>
					<img src={steward} alt="steward" style={{ '--x': '5vmax' }} />
					<img src={steward} alt="steward" style={{ '--x': '70vmax' }} />
				</>
			)}
		</div>
	)
}

export default Welcome
