import cls from './Footer.module.css'
import discord from '../../assets/img/discord.svg'
import telegram from '../../assets/img/telegram.png'
import goose from '../../assets/img/goose.svg'
import { useState } from 'react'
import classNames from 'classnames'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Footer = () => {
	const [show, setShow] = useState(false)

	function copu() {
		setShow(true)
		setTimeout(() => {
			setShow(false)
		}, 2500)
	}

	return (
		<div className={cls.footer}>
			<div className={cls.left}>
				<img src={goose} alt="goose" />
				{/* <p>Разработано Gusso специально для Совятника</p> */}
			</div>
			<div className={cls.right}>
				<p className={cls.title}>По всем вопросам обращаться</p>
				<CopyToClipboard text="Gus#6164">
					<img onClick={copu} src={discord} alt="discord" title="Скопировать в буффер обмена" />
				</CopyToClipboard>
				<p>Gus#6164</p>
				<CopyToClipboard text="@gusso">
					<img onClick={copu} src={telegram} alt="telegram" title="Скопировать в буффер обмена" />
				</CopyToClipboard>
				<p>@gusso</p>
				{<span className={classNames(cls.copu, show ? cls.show : cls.hide)}>Скопировано в буффер обмена!</span>}
			</div>
		</div>
	)
}

export default Footer
