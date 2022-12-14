import { useRef } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { classes, roles } from '../../assets/constants'
import axios from '../../axiosSettings'
import cls from './MyProfile.module.css'
import arrow from '../../assets/img/arrow.svg'
import cross from '../../assets/img/cross.svg'
import info from '../../assets/img/info.svg'
import eye from '../../assets/img/eye.svg'
import eyeHide from '../../assets/img/hide.svg'
import { useEffect } from 'react'
import { fetchUsers, update } from '../../Redux/slices/users'
import Loader from '../../Components/Loader/Loader'

const MyProfile = () => {
	const dispatch = useDispatch()
	const [showCharList, setShowCharlist] = useState(true)
	const [showRoleList, setShowRolelist] = useState(true)
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const { me, isLoading } = useSelector(state => state.users)
	const [inputName, setInputName] = useState(me.name)
	const [inputAvatar, setInputAvatar] = useState(me.avatar)
	const [group, setGroup] = useState(me.group)
	const [role, setRole] = useState(me.role)
	const [main, setMain] = useState(me.characters?.main.class)
	const [first, setFirst] = useState(me.characters?.first.class)
	const [second, setSecond] = useState(me.characters?.second.class)
	const [third, setThird] = useState(me.characters?.third.class)
	const [selectedChar, setSelectedChar] = useState(0)
	const character = useRef(0)
	const [showWarning, setShowWarning] = useState(false)
	const [showPass, setShowPass] = useState(false)
	const [success, setSuccess] = useState(false)

	function showClass(event) {
		if (event.target.dataset.char) {
			setShowCharlist(false)
			setSelectedChar(+event.target.dataset.char)
			character.current = +event.target.dataset.char
		}
	}

	function hide() {
		setShowCharlist(true)
		setSelectedChar(0)
	}

	function findColor(className) {
		for (let i = 0; i < classes.length; i++) {
			if (classes[i].title === className) {
				return classes[i].color
			}
		}
	}

	useEffect(() => {
		dispatch(fetchUsers())
	}, [])

	useEffect(() => {
		setInputName(me.name)
		setInputAvatar(me.avatar)
		setGroup(me.group)
		setRole(me.role)
		setMain(me.characters?.main.class)
		setFirst(me.characters?.first.class)
		setSecond(me.characters?.second.class)
		setThird(me.characters?.third.class)
	}, [isLoading])

	useEffect(() => {
		if (success) {
			setSuccess(false)
		}
	}, [inputName, password, confirm, inputAvatar, group, role, main, first, second, third])

	function selectClass(i) {
		switch (character.current) {
			case 1:
				setMain(classes[i].title)
				break
			case 2:
				setFirst(classes[i].title)
				break
			case 3:
				setSecond(classes[i].title)
				break
			case 4:
				setThird(classes[i].title)
				break
		}
		setShowCharlist(true)
		setSelectedChar(0)
	}

	function showRole(event) {
		if (event.target.dataset.role) {
			setShowRolelist(!showRoleList)
		}
	}

	function selectRole(i) {
		setRole(roles[i].title)
		setShowRolelist(!showRoleList)
	}

	function changeName(event) {
		if (inputName.length < 13) {
			setInputName(event.target.value)
		}
		if (inputName.length >= 13) {
			const prev = inputName
			const updated = prev.substring(0, prev.length - 1)
			setInputName(updated)
		}
	}

	async function getInfo() {
		const { data } = await axios().get('/users')
		dispatch(update({ ...data }))
	}

	async function save() {
		if (!success) {
			const req = {
				name: inputName,
				password: password === confirm ? password : '',
				avatar: inputAvatar,
				group,
				role,
				main,
				first,
				second,
				third,
			}
			const { data } = await axios().post('/user', { ...req })
			if (data.success) {
				setSuccess(true)
				getInfo()
			}
		}
	}

	function inc() {
		if (group < 10) {
			setGroup(group + 1)
		}
	}

	function dec() {
		if (group > 0) {
			setGroup(group - 1)
		}
	}

	return (
		<div className={cls.wrapper}>
			{isLoading ? (
				<div className={cls.loader}>
					{' '}
					<Loader />{' '}
				</div>
			) : (
				<>
					<div className={cls.inputs}>
						<div className={cls.name}>
							<p>??????:</p> <input type="text" value={inputName} onChange={changeName} />
						</div>
						<div className={cls.password}>
							<p>?????????????? ????????????</p>
							<div>
								<div className={cls.passPlace}>
									?????????? ?????????? ????????????:
									<input
										type={showPass ? 'text' : 'password'}
										value={password}
										onChange={e => setPassword(e.target.value)}
										placeholder={'???? ?????????? 5 ????????????????'}
									/>
									<img src={showPass ? eyeHide : eye} alt="eye" onClick={() => setShowPass(!showPass)} />
								</div>
								<div className={cls.passPlace}>
									?????????????????? ????????????:
									<input
										type={showPass ? 'text' : 'password'}
										value={confirm}
										onChange={e => setConfirm(e.target.value)}
										placeholder={'???? ?????????? 5 ????????????????'}
									/>
									<img src={showPass ? eyeHide : eye} alt="eye" onClick={() => setShowPass(!showPass)} />
								</div>
							</div>
							<img src={info} alt="info" onClick={() => setShowWarning(true)} />
							{showWarning && (
								<p className={cls.warning}>
									?? ?????????????????? ???????????????? ???????????????????? ???????????????????? ?? ???????????????? ???????????? ?? <br /> <span>???????????????? ????????</span>.{' '}
									<br /> ?? ?????????? ?????????????????????? ???? ???????????????????????? ???????????????????????? ???????????????????? ?????????????????? ?? ???????????????????????? ??????
									?????????????????????? <br /> <span>???????????????????? ????????????</span>, <br /> ?????????????? ???? ???????????????? ?? ????????????, ????????????????????????
									?????????? ????????????????! <br /> &nbsp; <br />{' '}
									<span onClick={() => setShowWarning(false)}>????????????, ?? ????????????????</span>
								</p>
							)}
						</div>
						<div className={cls.avatar}>
							<p>????????????????:</p>{' '}
							<textarea
								type="text"
								placeholder="???????????????? ???????????? ???????? ?????????????? ???? ????????????????, ???????????????????? ??????????????, ???????? ?????????? ???????????????? ???????? ????????????????, ?????????? ??????????. ???????????????????? ???????? ????????."
								value={inputAvatar}
								onChange={e => setInputAvatar(e.target.value)}
							/>
						</div>
					</div>
					<div className={cls.select}>
						<div className={cls.group}>
							<p>
								????????????: <br />
							</p>
							<span>{group}</span>
							<div>
								<img className={cls.up} src={arrow} alt="arrow" onClick={inc} />
								<img className={cls.down} src={arrow} alt="arrow" onClick={dec} />
							</div>
						</div>
						<div className={cls.role} onClick={showRole}>
							<p data-role={true}> ????????: {role}</p>
							<ul className={showRoleList ? cls.hide : cls.show}>
								{roles.map((el, i) => (
									<li key={el.title} style={{ '--color': el.color }} onClick={() => selectRole(i)}>
										{el.title}
									</li>
								))}
								<li>
									<img src={cross} alt="close" onClick={() => setShowRolelist(true)} />
								</li>
							</ul>
						</div>
						<div className={cls.characters} onClick={showClass}>
							<div data-char={1} className={selectedChar === 1 ? cls.active : ''}>
								Main: <span style={{ '--color': findColor(main) }}>{main}</span>
							</div>
							<div data-char={2} className={selectedChar === 2 ? cls.active : ''}>
								1st twink: <span style={{ '--color': findColor(first) }}>{first}</span>
							</div>
							<div data-char={3} className={selectedChar === 3 ? cls.active : ''}>
								2nd twink: <span style={{ '--color': findColor(second) }}>{second}</span>
							</div>
							<div data-char={4} className={selectedChar === 4 ? cls.active : ''}>
								3rd twink: <span style={{ '--color': findColor(third) }}>{third}</span>
							</div>
							<ul className={showCharList ? cls.hide : cls.show}>
								{classes.map((el, i) => (
									<li key={el.title} style={{ '--color': el.color }} onClick={() => selectClass(i)}>
										{el.title}
									</li>
								))}
								<li>
									<img src={cross} alt="close" onClick={hide} />
								</li>
							</ul>
						</div>
					</div>
					<button
						className={success ? cls.success : ''}
						onClick={save}
						disabled={showWarning || inputName?.length < 3 || password !== confirm}
					>
						{success ? '???' : '??????????????????'}
					</button>
				</>
			)}
		</div>
	)
}

export default MyProfile
