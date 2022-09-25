import { useDispatch } from 'react-redux'
import { fetchOrders } from '../../Redux/slices/orders'
import cls from './Confirm.module.css'

const Confirm = ({ text, callbackNo, callbackYes, children, id, type, request }) => {
	const dispatch = useDispatch()

	function clickYes() {
		if (type === 'admin') {
			callbackYes(id)
			callbackNo()
			dispatch(fetchOrders())
		}

		if (type === 'period') {
			callbackYes(request)
			callbackNo()
		}
	}

	function clickNo() {
		if (type === 'admin' || type === 'period') {
			callbackNo()
		}
	}

	return (
		<div className={cls.wrapper}>
			<div className={cls.content}>
				<p>{text}</p>
				{type === 'admin' && <div className={cls.chield}>{children}</div>}
				{type === 'period' && <p className={cls.period}>{children}</p>}
				<div className={cls.buttons}>
					<button onClick={clickNo}>Отмена</button>
					<button onClick={clickYes}>Продолжить</button>
				</div>
			</div>
		</div>
	)
}

export default Confirm
