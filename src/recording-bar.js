import React from 'react'

export const RecordingBar = ({ getIsRecording }) => {
    const [width, setWidth] = React.useState(0);

    React.useEffect(() => {
        if (getIsRecording()) {
            if (width === 100) {
                setWidth(0)
            } else {
                setWidth(100)
            }
        }
    }, [width, getIsRecording])

    return (
        <div className={`external-record-bar ${getIsRecording() ? 'button-glow' : ''}`}>
            <div style={{ width: `${width}%`, transition: "width 2s" }} className="internal-record-bar button-glow"></div>
        </div>
    )
}