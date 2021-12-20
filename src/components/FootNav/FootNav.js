import { Email, EmailOutlined, Home, HomeOutlined, Notifications, NotificationsOutlined, SearchOutlined } from '@material-ui/icons'
import React from 'react'
import { useHistory } from 'react-router-dom'
import './FootNav.css'
import { useStateValue } from '../../StateProvider'

function FootNav({ home, notification, messages }) {
    const [{ user }] = useStateValue()
    const history = useHistory()

    const handleClickProfile = () => {
        if(user) {
            history.push('/profile')
        } else {
            history.push('login')
        }
    }

    return (
        <div className="footNav">
            <div 
              className="footNav__Icon" 
              style={{ color: home ? 'rgb(0, 172, 0)' : '' }} 
              onClick={() => history.push('/')}>
                <div>
                    {home ? 
                        <Home fontSize="small" /> :
                        <HomeOutlined fontSize="small" />
                    }
                </div>
                <span>Home</span>
            </div>

            <div className="footNav__Icon">
                <div>
                    <SearchOutlined fontSize="small" />
                </div>
                <span>Search</span>
            </div>

            <div className="footNav__Icon">
                <div>
                    {messages ?
                        <Email fontSize="small" /> :
                        <EmailOutlined fontSize="small" />
                    }
                </div>
                <span>Messages</span>
            </div>

            <div 
              className="footNav__Icon" 
              style={{ color: notification ? 'rgb(0, 172, 0)' : '' }} 
              onClick={handleClickProfile}
            >
                <div>
                    {notification ?
                        <Notifications fontSize="small" /> :
                        <NotificationsOutlined fontSize="small" />
                    }
                </div>
                <span>Notifications</span>
            </div>
        </div>
    )
}

export default FootNav
