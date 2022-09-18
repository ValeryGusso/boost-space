import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchLogin, fetchToken } from '../../Redux/slices/auth'
import { fetchUsers } from '../../Redux/slices/users'
import eye from '../../assets/img/eye.svg'
import eyeHide from '../../assets/img/hide.svg'
import cls from './Login.module.css'
import classNames from 'classnames'

const Login = () => {
	const dispath = useDispatch()
	const navigate = useNavigate()
	const token = useSelector(state => state.auth.token)
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [nameErr, setNameErr] = useState(false)
	const [passErr, setPassErr] = useState(false)
	const [showPass, setShowPass] = useState(false)

	function keydown(event) {
		if (event.keyCode === 13 && name.length > 2 && password.length > 4) {
			clickLogin()
		}
	}

	useEffect(() => {
		if (token) {
			dispath(fetchToken({ token }))
			dispath(fetchUsers())
			navigate('/home')
		}
	}, [token])

	useEffect(() => {
		setNameErr(false)
	}, [name])

	useEffect(() => {
		setPassErr(false)
	}, [password])

	const clickLogin = async () => {
		await dispath(fetchLogin({ name, password }))
		!token && setNameErr(true)
		!token && setPassErr(true)
	}

	const changeName = event => {
		setName(event.target.value)
	}

	const changePassword = event => {
		setPassword(event.target.value)
	}

	return (
		<div className={cls.wrapper}>
			<div className={nameErr ? cls.err : ''}>
				<p>Имя: </p>
				<input type="text" value={name} onChange={changeName} />
			</div>
			<div className={classNames(passErr ? cls.err : '', cls.pass)}>
				<p>Пароль: </p>
				<input type={showPass ? 'text' : 'password'} value={password} onChange={changePassword} onKeyDown={keydown} />
				<img src={showPass ? eyeHide : eye} alt="eye" onClick={() => setShowPass(!showPass)} />
			</div>
			<button onClick={clickLogin} disabled={!(name.length > 2 && password.length > 4)}>
				Войти
			</button>
		</div>
	)
}

export default Login
