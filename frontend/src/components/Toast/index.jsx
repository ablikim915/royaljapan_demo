import { useEffect, useRef, useState } from "react";
import './index.scss';

// React component (keep as named to allow programmatic API export)
export function ToastComponent({ show = false, message = "", type = "info", onClose = () => {}, duration = 4000 }) {
    const [visible, setVisible] = useState(show);
    const [progress, setProgress] = useState(100);
    const timerRef = useRef(null);
    const startRef = useRef(null);
    const remainingRef = useRef(duration);

    // map types to colors (can be overridden by global css if desired)
        const TYPE = {
            success: { icon: "" },
            error: { icon: "✕" },
            warning: { icon: "!" },
            info: { icon: "" },
            loading: { icon: "" },
        };

    const styleForType = TYPE[type] || TYPE.info;

    useEffect(() => {
        setVisible(show);
    }, [show]);

        // start auto-dismiss timer when visible (except for loading type unless a positive duration provided)
        useEffect(() => {
            if (!visible) {
                clearTimer();
                setProgress(0);
                return;
            }
            remainingRef.current = duration;
            // do not auto-dismiss for loading type unless duration > 0
            if (type !== "loading" && duration > 0) {
                startTimer();
            } else if (type === "loading") {
                // keep progress at 100 for loading and show indeterminate animation via CSS
                setProgress(100);
            }

            return () => clearTimer();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [visible, type]);

    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (startRef.current) {
            startRef.current = null;
        }
    };

    const startTimer = () => {
        clearTimer();
        const start = Date.now();
        startRef.current = start;
        const total = duration;
        // progress update interval 50ms
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startRef.current;
            const pct = Math.max(0, 100 - Math.round((elapsed / total) * 100));
            setProgress(pct);
            if (elapsed >= total) {
                clearTimer();
                handleClose();
            }
        }, 50);
    };

    const pauseTimer = () => {
        if (!timerRef.current) return;
        const elapsed = Date.now() - startRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
        clearTimer();
    };

    const resumeTimer = () => {
        if (remainingRef.current <= 0) return;
        startRef.current = Date.now();
        const total = remainingRef.current;
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startRef.current;
            const pct = Math.max(0, 100 - Math.round((elapsed / total) * 100));
            setProgress(pct);
            if (elapsed >= total) {
                clearTimer();
                handleClose();
            }
        }, 50);
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose && onClose();
        }, 200);
    };

    if (!visible) return null;

    return (
        <div
            className="toast-portal"
            role="status"
            aria-live="polite"
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
            onFocus={pauseTimer}
            onBlur={resumeTimer}
        >
            <div className="toast">
                <div className="toast-icon" aria-hidden>
                    {type === "loading" ? (
                        <svg className="toast-spinner" width="20" height="20" viewBox="0 0 50 50" aria-hidden>
                            <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="6"></circle>
                            <path d="M45 25a20 20 0 0 1-20 20" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"></path>
                        </svg>
                    ) : (
                        styleForType.icon
                    )}
                </div>
                <div className="toast-body">
                    <div className="toast-message">{message}</div>
                </div>
            </div>
            <div
                className={"toast-progress " + (type === "loading" ? "indeterminate" : "")}
            />

            {/* using external SCSS file for styling: index.scss */}
        </div>
    );
}

// keep default export for JSX usage
export default ToastComponent;

// Programmatic API: Toast({ type, message, duration, onClose })
// returns { update, close }
export function Toast(opts = {}) {
    if (typeof window === 'undefined') return { update: () => {}, close: () => {} };

    const { type = 'info', message = '', duration = 0, onClose } = opts;

    // create unique container for this toast
    const container = document.createElement('div');
    container.className = 'toast-instance-root';
    document.body.appendChild(container);

    // lazy require to avoid SSR issues
    // eslint-disable-next-line global-require
    const React = require('react');
    // eslint-disable-next-line global-require
    const { createRoot } = require('react-dom/client');
    const root = createRoot(container);

    let currentProps = {
        show: true,
        message,
        type: 'info',
        duration: 2500,
        onClose: () => {
            try { root.unmount(); } catch (e) {}
            if (container && container.parentNode) container.parentNode.removeChild(container);
            if (typeof onClose === 'function') onClose();
        }
    };

    const render = (props) => root.render(React.createElement(ToastComponent, props));

    render(currentProps);

    return {
        update(next = {}) {
            currentProps = { ...currentProps, ...next };
            render(currentProps);
        },
        close() {
            currentProps = { ...currentProps, show: false };
            render(currentProps);
            currentProps.onClose()
        }
    };
}