const Icon = ({ show = true, icon = '', style = {} }) =>
    show ? (
        <span style={{ fontSize: '14px' }}>
            <i className={icon} style={style} />
        </span>
    ) : null

export default Icon
