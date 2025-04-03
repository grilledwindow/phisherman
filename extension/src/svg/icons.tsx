type SvgProps = {
    fill: string
};

export const ErrorCircle = (props: SvgProps) => {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ fill: props.fill, transform: ';msFilter:' }}><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
}

export const CheckCircle = (props: SvgProps) => {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ fill: props.fill, transform: ';msFilter:' }}><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"></path></svg>
}

export const WarningCone = (props: SvgProps) => {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ fill: props.fill, transform: ';msFilter:' }}><path d="M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.467L12.884 2.532zM13 18h-2v-2h2v2zm-2-4V9h2l.001 5H11z"></path></svg>
}

export const Loader = (props: SvgProps) => {
    return<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ fill: props.fill, transform: ';msFilter:' }}><path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"></path></svg> 
}
