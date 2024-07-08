const Icon = ({ show = true, icon = '', style = {} }) =>
    show ? (
        <i className={icon} style={style} />
    ) : null

export default Icon
