import cls from './Footer.module.css'
import discord from '../../assets/img/discord.svg'
import telegram from '../../assets/img/telegram.png'
import goose from '../../assets/img/goose.svg'

const Footer = () => {
	return (
		<div className={cls.footer}>
			<div className={cls.left}>
				{/* <img src={goose} alt="goose" /> */}
				{/* <p>Разработано Gusso специально для Совятника</p> */}
			</div>
			<div className={cls.right}>
				<p className={cls.title}>По всем вопросам обращаться</p>
				<img src={discord} alt="discord" />
				<p>Gus#6164</p>
				<img src={telegram} alt="telegram" />
				<p>@gusso</p>
			</div>
		</div>
	)
}

export default Footer
