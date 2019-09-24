import React, { useState, useMemo, useCallback, useRef } from "react";
import posed from "react-pose";

import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

export function useEventListener(eventName, handler, element = window) {
    const savedHandler = React.useRef();
    React.useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);
    React.useEffect(() => {
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;
        const eventListener = event => savedHandler.current(event);
        element.addEventListener(eventName, eventListener);
        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
}

const transition = {
    duration: 400,
    ease: [0.08, 0.69, 0.2, 0.99]
};

const Behind = posed.div({
    init: {
        applyAtEnd: { display: "none" },
        opacity: 0
    },
    zoom: {
        applyAtStart: { display: "block" },
        opacity: 1
    }
});

const Image = posed.img({
    init: {
        position: "static",
        width: "100%",
        height: "auto",
        flip: true,
        transition
    },
    zoom: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flip: true,
        transition,
        width: ({ fullWidth }) => (fullWidth ? "100%" : "auto"),
        height: ({ fullWidth }) => (!fullWidth ? "100%" : "auto")
    }
});

export default function ZoomImg(props) {
    const classes = useStyles();
    const [zoomed, setZoomed] = useState(false);
    const ref = useRef(null);
    const [loader, setLoading] = useState(true);
    const [fullWidth, setFullWidth] = useState(true);

    const pose = useMemo(() => (zoomed ? "zoom" : "init"), [zoomed]);
    const toggle = useCallback(() => setZoomed(!zoomed), [zoomed]);
    const unzoom = useCallback(() => setZoomed(false), []);

    const updateSizing = useCallback(() => {
        if (ref.current) {
            const { offsetWidth: w, offsetHeight: h } = ref.current;
            const full = { w: window.innerWidth, h: window.innerHeight };
            const ratio = {
                w: w / full.w,
                h: h / full.h
            };
            setFullWidth(ratio.w > ratio.h);
            setLoading(false)
        }
    }, [ref]);

    useEventListener("wheel", unzoom);
    useEventListener("resize", updateSizing);

    return (
        <>
            <Behind pose={pose} className='behind' />
            {
                loader ?
                <div className={classes.root}>
                    <LinearProgress />
                <br />
                    <LinearProgress color="secondary" />
                </div>
                    : null }
                <Image
                  className={`img ${zoomed ? zoomed : ""}`}
                  onClick={toggle}
                  pose={pose}
                  onLoad={updateSizing}
                  fullWidth={fullWidth}
                  ref={ref}
                  alt=""
                  {...props}
                />

        </>
    );
}
