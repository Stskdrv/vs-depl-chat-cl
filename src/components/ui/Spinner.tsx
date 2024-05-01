
interface Props {
    height: number,
    width: number,
    color: string,
}

const Spinner = ({ height, width, color }: Props) => {
    return (
        <div className="flex items-center justify-center">
            <div style={{
                height: `${height}px`,
                width: `${width}px`,
                borderColor: color,
            }} className={`animate-spin rounded-full border-t-2`}></div>
        </div>
    );
};

export default Spinner;