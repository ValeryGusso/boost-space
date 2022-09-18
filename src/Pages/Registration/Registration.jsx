import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import axios from '../../axiosSettings'
import { registration } from '../../Redux/slices/auth'
import { fetchUsers } from '../../Redux/slices/users'
import cls from './Registration.module.css'
import eye from '../../assets/img/eye.svg'
import eyeHide from '../../assets/img/hide.svg'
import info from '../../assets/img/info.svg'
import { useCallback } from 'react'

const Registration = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [invite, setInvite] = useState('')
	const [nameErr, setNameErr] = useState(false)
	const [nameLock, setNameLock] = useState(false)
	const [passErr, setPassErr] = useState(false)
	const [inviteErr, setInviteErr] = useState(false)
	const [showPass, setShowPass] = useState(false)
	const [showWarning, setShowWarning] = useState(false)

	const keydown = useCallback(event => {
		if (event.keyCode === 13 && name.length > 2 && password.length > 4 && confirm.length > 4) {
			reg()
		}
	}, [])

	useEffect(() => {
		setInviteErr(false)
	}, [invite])

	useEffect(() => {
		setNameErr(false)
		setNameLock(false)
	}, [name])

	useEffect(() => {
		setPassErr(false)
	}, [password, confirm])

	function changeName(event) {
		setName(event.target.value)
	}

	function changePassword(event) {
		setPassword(event.target.value)
	}

	function changeConfirm(event) {
		setConfirm(event.target.value)
	}

	function changeInvite(event) {
		setInvite(event.target.value)
	}

	async function reg() {
		if (password === confirm) {
			const { data } = await axios()
				.post('/reg', { name, password, invite })
				.catch(err => {
					if (err.response.data.message === 'Код-приглашение недействителен') {
						setInviteErr(true)
					}
					if (err.response.data.message === 'Не удалось зарегистрироваться') {
						setNameLock(true)
					}

					err.response.data.forEach(el => {
						if (el.msg === 'Код-приглашение указан неверно') {
							setInviteErr(true)
						}
						if (el.msg === 'Имя должно состоять из 3х и более символов') {
							setNameErr(true)
						}
					})
				})

			if (data._id) {
				dispatch(registration(data))
				dispatch(fetchUsers())
				navigate('/home')
			}
		} else {
			setPassErr(true)
		}
	}

	return (
		<div className={cls.frame}>
			<div className={cls.wrapper}>
				<div className={classNames(nameErr ? cls.nameErr : '', nameLock ? cls.nameLock : '')}>
					<p>Имя: </p>
					<input
						type="text"
						value={name}
						onChange={changeName}
						placeholder="Не менее 3х символов"
						onKeyDown={keydown}
					/>
				</div>
				<div className={classNames(passErr ? cls.passError : '', cls.pass)}>
					<p>Пароль: </p>
					<input
						className={cls.invisible}
						type={showPass ? 'text' : 'password'}
						value={password}
						onChange={changePassword}
						placeholder="Не менее 5 символов"
						onKeyDown={keydown}
					/>
					<img src={showPass ? eyeHide : eye} alt="eye" onClick={() => setShowPass(!showPass)} />
				</div>
				<div className={classNames(passErr ? cls.passError : '', cls.pass)}>
					<p>Подтверди пароль: </p>
					<input
						type={showPass ? 'text' : 'password'}
						value={confirm}
						onChange={changeConfirm}
						placeholder="Не менее 5 символов"
						onKeyDown={keydown}
					/>
					<img src={showPass ? eyeHide : eye} alt="eye" onClick={() => setShowPass(!showPass)} />
				</div>
				<div className={classNames(cls.invite, inviteErr ? cls.inviteErr : '')}>
					<p>Код-приглашение: </p>
					<textarea
						value={invite}
						onChange={changeInvite}
						placeholder="Для получения приглашения обратись к одному из действующих офицеров состава"
						onKeyDown={keydown}
					/>
				</div>
				<button onClick={reg} disabled={!(password.length > 4 && confirm.length > 4 && name.length > 2)}>
					Зарегистрироваться
				</button>
			</div>
			<img src={info} alt="info" onClick={() => setShowWarning(true)} />
			{showWarning && (
				<p className={cls.warning}>
					В некоторых моментах приложение использует и передаёт пароли в <br /> <span>открытом виде</span>. <br /> В
					целях собственной же безопасности настоятельно рекомендую придумать и использовать для авторизации <br />{' '}
					<span>уникальный пароль</span>, <br /> который не подходит к другим, используемым тобой сервисам! <br />{' '}
					&nbsp; <br /> <span onClick={() => setShowWarning(false)}>Хорошо, я согласен</span>
				</p>
			)}
		</div>
	)
}

export default Registration
