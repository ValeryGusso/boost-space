import { useState } from 'react'
import axios from '../../axiosSettings'
import cls from './Admin.module.css'
import arrow from '../../assets/img/arrow.svg'
import { useDispatch, useSelector } from 'react-redux'
import Row from '../../Components/Row/Row'
import Loader from '../../Components/Loader/Loader'
import remove from '../../assets/img/delete.svg'
import edit from '../../assets/img/edit.svg'
import { useEffect } from 'react'
import { fetchOrders } from '../../Redux/slices/orders'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Confirm from '../../Components/Confirm/Confirm'

const confirmText = 'Ты действительно уверен, что хочешь удалить заказ? Это действие невозможно отменить.'

const Admin = () => {
	const dispatch = useDispatch()
	const [counter, setCounter] = useState()
	const [invite, setInvite] = useState('')
	const [endTime, setEndTime] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [group, setGroup] = useState(0)
	const { items: orders, isLoaded } = useSelector(state => state.orders)
	const int = useRef()
	const confirmProps = useRef()

	function start() {
		setCounter(299)
		setEndTime(false)
		int.current = setInterval(() => {
			setCounter(prevCounter => {
				if (prevCounter === 0) {
					clearInterval(int.current)
					setInvite('')
					setEndTime(true)
					return
				}
				return prevCounter - 1
			})
		}, 1000)
	}

	useEffect(() => {
		dispatch(fetchOrders())
	}, [])

	async function createInvite() {
		const { data } = await axios().post('/invite', { group })
		setInvite(data)
		start()
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

	async function removeOrder(id, children) {
		setShowConfirm(true)
		const cbNo = () => setShowConfirm(false)
		const cbYes = async id => await axios().delete('/orders/' + id)
		confirmProps.current = { id, children, callbackNo: cbNo, callbackYes: cbYes }
		console.log(confirmProps.current)
	}

	return (
		<div className={cls.wrapper}>
			<div className={cls.invite}>
				<div className={cls.change_group}>
					<p>
						Группа: <br /> <span>{group}</span>
					</p>
					<div>
						<img className={cls.up} src={arrow} alt="arrow" onClick={inc} />
						<img className={cls.down} src={arrow} alt="arrow" onClick={dec} />
					</div>
					<span>0 - френд слот / без группы</span>
				</div>
				<button onClick={createInvite}>Создать приглашение</button>
				<textarea value={invite} readOnly={true}></textarea>
				<div className={cls.helpers}>
					{invite && (
						<p>
							Поторопись! Срок действия кода-приглашения истекает через <br />
							{Math.floor(counter / 60)}m {counter % 60}c
						</p>
					)}
					{endTime && <p>Срок действия приглашения истёк! Сгенерируй новое...</p>}
				</div>
			</div>
			<div className={cls.orders}>
				{isLoaded ? (
					orders.map(el => (
						<div key={el._id + 'sfsdf'} className={cls.content}>
							<div key={el._id + 'dffffax'} className={cls.row}>
								<Row
									key={el._id}
									date={el.date}
									type={el.type}
									group={el.group}
									price={el.price}
									tax={el.tax}
									currency={el.currency}
									description={el.description}
									orderLink={el.orderLink}
									priceLink={el.priceLink}
								/>
							</div>
							<div key={el._id + 'cvbxn'} className={cls.images}>
								<Link to={`/edit/${el._id}`}>
									{' '}
									<img
										key={el._id + 'hbvgfv'}
										style={{ '--x': '-2vmax', '--y': '-1.5vmin' }}
										src={edit}
										alt="edit"
										title="Редактировать"
									/>
								</Link>
								<img
									key={el._id + 'bvzt'}
									style={{ '--x': '2vmax', '--y': '-1.5vmin' }}
									src={remove}
									alt="remove"
									title="Удалить"
									onClick={() =>
										removeOrder(
											el._id,
											<Row
												key={el._id}
												date={el.date}
												type={el.type}
												group={el.group}
												price={el.price}
												tax={el.tax}
												currency={el.currency}
												description={el.description}
												orderLink={el.orderLink}
												priceLink={el.priceLink}
											/>
										)
									}
								/>
							</div>
						</div>
					))
				) : (
					<div className={cls.loader}>
						<Loader />
					</div>
				)}
			</div>
			{showConfirm && (
				<Confirm
					type="admin"
					text={confirmText}
					children={confirmProps.current.children}
					callbackNo={confirmProps.current.callbackNo}
					callbackYes={confirmProps.current.callbackYes}
					id={confirmProps.current.id}
				/>
			)}
		</div>
	)
}

export default Admin
