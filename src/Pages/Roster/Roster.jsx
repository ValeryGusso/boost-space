import { useState } from 'react'
import { useSelector } from 'react-redux'
import User from '../../Components/User/User'
import cls from './Roster.module.css'

const Roster = () => {
	const { allUsers } = useSelector(state => state.users)

	return (
		<div className={cls.container}>
			{allUsers.map(user => {
				return <User key={user.id} user={user} />
			})}
		</div>
	)
}

export default Roster
