export default async function Homecolor({color}) {
    document.documentElement.style.setProperty('--Color', color)
}