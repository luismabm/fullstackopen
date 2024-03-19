const Notification = ({ notification }) => {
    if (notification === null || notification.message === undefined) {
        return null
    }
    if(notification.type === undefined) {
        notification.type = 'success'
    }
  
    return (
        <div className={notification.type}>
            {notification.message}
        </div>
    )
}

export default Notification