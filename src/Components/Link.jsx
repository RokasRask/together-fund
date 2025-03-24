export default function Link({ to, children }) {

    return (
        <a className="nav-link" href={'#' + to}>{children}</a>
    );

}