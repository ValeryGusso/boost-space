import { useState } from 'react'
import cls from './User.module.css'
import arrow from '../../assets/img/arrow.svg'
import classNames from 'classnames'
import axios from '../../axiosSettings'
import { update } from '../../Redux/slices/users'
import { useDispatch } from 'react-redux'

const User = ({ user }) => {
	const [name, setName] = useState(user.name)
	const [group, setGroup] = useState(user.group)
	const [active, setActive] = useState(user.active)
	const [wasChanged, setWasChanged] = useState(false)
	const dispatch = useDispatch()

	function changeActive() {
		setActive(!active)
		setWasChanged(true)
		setName('Сохранить')
	}

	function changeGroup(num) {
		if (num >= 0 && num <= 9) {
			setGroup(num)
			setWasChanged(true)
			setName('Сохранить')
		}
	}

	async function fetchChanges() {
		if (wasChanged) {
			const body = {
				id: user.id,
				group,
				active,
			}

			const { data } = await axios().post('/user/status', body)

			if (data.success) {
				setWasChanged(false)
				dispatch(update(data))
			}
		}
	}

	function mouseEnter() {
		if (wasChanged) {
			setName(user.name)
		}
	}

	function mouseLeave() {
		if (wasChanged) {
			setName('Сохранить')
		}
	}

	return (
		<div className={cls.user}>
			<div
				onMouseEnter={mouseEnter}
				onMouseLeave={mouseLeave}
				onClick={fetchChanges}
				className={classNames(cls.name, wasChanged && cls.greenbg)}
			>
				{name}
			</div>
			<div className={cls.group}>
				{group}
				<img onClick={() => changeGroup(group + 1)} className={cls.up} src={arrow} alt="up" />
				<img onClick={() => changeGroup(group - 1)} className={cls.down} src={arrow} alt="down" />
			</div>
			<div onDoubleClick={changeActive} className={classNames(cls.active, active && cls.greenbg)}>
				{active ? 'Активен' : 'Запас'}
			</div>
		</div>
	)
}

export default User
