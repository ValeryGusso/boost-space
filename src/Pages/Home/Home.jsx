import classNames from 'classnames'
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { colors, dungeonLvls, dungeonsTitles } from '../../assets/constants'
import axios from '../../axiosSettings'
import Group from '../../Components/Group/Group'
import Loader from '../../Components/Loader/Loader'
import { fetchUsers, update } from '../../Redux/slices/users'
import cls from './Home.module.css'

const Home = () => {
	const dispatch = useDispatch()
	const id = useSelector(state => state.auth.id)
	const { data, groupCounter, isLoading } = useSelector(state => state.users)
	const [search, setSearch] = useState([])
	const [titlePosition, setTitlePosition] = useState({ x: 500, y: 350 })
	const [lvlPosition, setLvlPosition] = useState({ x: 500, y: 350 })
	const [showTitle, setShowTitle] = useState(false)
	const [showLvl, setShowLvl] = useState(false)
	const character = useRef()
	const socket = useRef('')

	async function getInfo() {
		const { data } = await axios().get('/users')
		dispatch(update({ ...data }))
	}

	function setColor(title) {
		const colorsTable = []
		search.map((el, i) => colorsTable.push({ title: el, color: colors[i] }))
		if (colorsTable.length > 0) {
			for (let i = 0; i < colorsTable.length; i++) {
				if (colorsTable[i].title === title) {
					return colorsTable[i].color
				}
			}
		}
	}

	useEffect(() => {
		dispatch(fetchUsers())
		socket.current = new WebSocket(process.env.REACT_APP_WS_URL)
		// socket.current = new WebSocket('ws://localhost:666/ws')
		socket.current.onmessage = event => {
			const parsed = JSON.parse(event.data)

			if (parsed.updated) {
				getInfo()
			}
		}

		return () => {
			socket.current.close()
			socket.current = null
		}
	}, [])

	function select(el) {
		const prev = [...search]

		if (prev.includes(el)) {
			prev.splice(prev.indexOf(el), 1)
		} else {
			prev.push(el)
		}

		setSearch(prev)
	}

	function click(event) {
		const ds = event.target.dataset
		const x = event.clientX
		const y = event.clientY
		const vmin = window.innerHeight / 100
		const vmax = window.innerWidth / 100

		if (ds.titleid === id) {
			setShowTitle(true)
			setTitlePosition({ x: x / vmax - 1 + 'vmax', y: y / vmin - 12 + 'vmin' })
			character.current = ds.character
		} else {
			setShowTitle(false)
		}

		if (ds.lvlid === id) {
			setShowLvl(true)
			setLvlPosition({ x: x / vmax - 1 + 'vmax', y: y / vmin - 20 + 'vmin' })
			character.current = ds.character
		} else {
			setShowLvl(false)
		}
	}

	async function setInfo(event) {
		const ds = event.target.dataset

		if (ds.key) {
			const req = { [character.current]: { key: ds.key } }
			const { data } = await axios().post('/user/keys', req)
			dispatch(update({ ...data }))
		}
		if (ds.lvl) {
			const req = { [character.current]: { lvl: ds.lvl } }
			const { data } = await axios().post('/user/keys', req)
			dispatch(update({ ...data }))
		}

		socket.current.send(JSON.stringify({ updated: true }))
	}

	return (
		<div className={cls.wrapper} onClick={click}>
			<div className={cls.keys}>
				{!isLoading ? (
					groupCounter.map(el => {
						return (
							<div className={cls.row} key={el}>
								<Group
									key={el}
									players={data.filter(user => +user.group === el)}
									title={el > 0 ? 'Группа' : 'Запас'}
									search={search}
									num={el}
								/>
							</div>
						)
					})
				) : (
					<div className={cls.loader}>
						<Loader />
					</div>
				)}
			</div>
			<div className={cls.search}>
				<p>Поиск ключей: </p>
				<ul>
					{dungeonsTitles.map(el => {
						return (
							el !== '---' && (
								<li
									style={{ '--c': setColor(el) }}
									key={el}
									className={search.includes(el) ? cls.searched : cls.nonsearched}
									onClick={() => select(el)}
								>
									{el}
								</li>
							)
						)
					})}
				</ul>
			</div>
			<div
				className={classNames(cls.titleSelect, showTitle ? cls.show : cls.hide)}
				style={{ '--titlex': titlePosition.x, '--titley': titlePosition.y }}
			>
				<ul>
					{dungeonsTitles.map(el => (
						<li key={el} data-key={el} onClick={setInfo}>
							{el}
						</li>
					))}
				</ul>
			</div>
			<div
				className={classNames(cls.lvlSelect, showLvl ? cls.show : cls.hide)}
				style={{ '--lvlx': lvlPosition.x, '--lvly': lvlPosition.y }}
			>
				<ul>
					{dungeonLvls.map(el => (
						<li key={el} data-lvl={el} onClick={setInfo}>
							{el}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default Home
