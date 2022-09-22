import classNames from 'classnames'
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dungeonLvls, dungeonsTitles } from '../../assets/constants'
import axios from '../../axiosSettings'
import Group from '../../Components/Group/Group'
import Loader from '../../Components/Loader/Loader'
import { fetchUsers } from '../../Redux/slices/users'
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
	const websocket = process.env.REACT_APP_API_URL.replace('https', 'ws') + 'ws'
	const socket = useRef(new WebSocket(websocket))

	useEffect(() => {

		socket.current.onmessage = event => {
			const parsed = JSON.parse(event.data)

			if (parsed.updated) {
				dispatch(fetchUsers())
			}
		}

		return () => socket.current.close()
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
			setTitlePosition({ x: x / vmax - 1 + 'vmax', y: y / vmin - 17 + 'vmin' })
			character.current = ds.character
		} else {
			setShowTitle(false)
		}

		if (ds.lvlid === id) {
			setShowLvl(true)
			setLvlPosition({ x: x / vmax - 1 + 'vmax', y: y / vmin - 29 + 'vmin' })
			character.current = ds.character
		} else {
			setShowLvl(false)
		}
	}

	async function setInfo(event) {
		const ds = event.target.dataset

		if (ds.key) {
			const req = { [character.current]: { key: ds.key } }
			await axios().post('/user/keys', req)
			dispatch(fetchUsers())
		}
		if (ds.lvl) {
			const req = { [character.current]: { lvl: ds.lvl } }
			await axios().post('/user/keys', req)
			dispatch(fetchUsers())
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
