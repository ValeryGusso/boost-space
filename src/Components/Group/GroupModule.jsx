import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { dungeonsTitles } from '../../assets/constants'
import cls from './GroupModule.module.css'

const titles = [
	{ title: 'Main', key: 'main' },
	{ title: '1st twink', key: 'first' },
	{ title: '2nd twink', key: 'second' },
	{ title: '3rd twink', key: 'third' },
]

const GroupModule = ({ characters, title, search }) => {
	const id = useSelector(state => state.auth.id)

	return (
		<div className={cls.wrapper}>
			<div className={cls.title}>
				<p>{titles[title].title}</p>
				<p>Key</p>
			</div>
			<div className={cls.class}>
				{characters.map(el => (
					<div key={el.id} className={search.includes(el.data.key) ? cls.searched : ''}>
						{el.data.class || '---'}
					</div>
				))}
			</div>
			<div className={cls.key}>
				{characters.map(el => (
					<div
						className={classNames(
							id === el.id && el.data.class ? cls.my : '',
							search.includes(el.data.key) ? cls.searched : ''
						)}
						data-titleid={el.id}
						data-character={titles[title].key}
						key={el.id}
					>
						{(search.length > 0 ? search : dungeonsTitles).join(',').includes(el.data.key)
							? el.data.key || '---'
							: '---'}
					</div>
				))}
			</div>
			<div className={cls.lvl}>
				{characters.map(el => (
					<div
						className={classNames(
							id === el.id && el.data.class ? cls.my : '',
							search.includes(el.data.key) ? cls.searched : ''
						)}
						data-lvlid={el.id}
						data-character={titles[title].key}
						key={el.id}
					>
						{(search.length > 0 ? search : dungeonsTitles).join(',').includes(el.data.key)
							? el.data.lvl > 0
								? el.data.lvl
								: '---'
							: '---'}
					</div>
				))}
			</div>
		</div>
	)
}

export default GroupModule
