import cls from './Group.module.css'
import GroupModule from './GroupModule'

const Group = ({ players, search, title, num }) => {
	
	const main = []
	const first = []
	const second = []
	const third = []
	players.map(el => main.push({data: el.characters.main, id: el._id}))
	players.map(el => first.push({data: el.characters.first, id: el._id}))
	players.map(el => second.push({data: el.characters.second, id: el._id}))
	players.map(el => third.push({data: el.characters.third, id: el._id}))

	return (
		<div className={cls.wrapper}>
			<p className={cls.grp}>{title}:</p>
			{title === 'Группа' ? <div className={cls.group}>{num}</div> : ''}
			<div className={cls.names}>
				{players.map(el => {
					return <div key={el._id}>{el.name}</div>
				})}
			</div>
			<GroupModule characters={main} title={0} search={search}/>
			<GroupModule characters={first} title={1} search={search}/>
			<GroupModule characters={second} title={2} search={search}/>
			<GroupModule characters={third} title={3} search={search}/>
		</div>
	)
}

export default Group
