let main = document.getElementById('container')
let colorContainer = document.getElementById('color-container')
let header = document.querySelector('header')

fetch("assets/data.json")
    .then((response) => response.json())
    .then((data) => {
        // console.log(data.colorPalettes);
        let colors = data.colorPalettes
        if (colors) {
            fillContainer(colors)
        }
    })
    .catch((error) => console.error("Error fetching data:", error));

function isColorDark(color) {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 128;
}

function fillContainer(data) {
    data.forEach(color => {
        // console.log(color.colors)
        // console.log(color.paletteName.trim().replace(/\s+/g, '').toLowerCase());

        const colorBox = document.createElement('div')
        const stripesContainer = document.createElement('div')
        const colorDetail = document.createElement('div')
        const btns = document.createElement('div')
        btns.classList.add('buttons');
        const copyBtn = document.createElement('button')
        const demoBtn = document.createElement('button')

        copyBtn.innerText = 'Copy '
        demoBtn.innerText = 'Demo'

        btns.appendChild(copyBtn)
        btns.appendChild(demoBtn)

        colorBox.classList.add('color-box')
        stripesContainer.classList.add('stripes-container')
        colorDetail.classList.add('detail-container')

        let colorName = document.createElement('h3')
        colorName.innerText = color.paletteName
        let colorNameLink = color.paletteName.trim().replace(/\s+/g, '').toLowerCase()
        copyBtn.addEventListener('click', () => {
            let themeColors = color.colors
            let theme = `
            :root{
                /* From ToneTrove by Lovansh */
                --background: ${themeColors[0]};
                --color: ${themeColors[3]};
                --accent: ${themeColors[2]};
                --theme: ${themeColors[1]};
                }
            `
            console.log('copied', theme)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(theme)
                    .then(() => console.log("copied!"))
                    .catch(err => console.error("clipboard failed", err));
            } else {
                console.warn("Clipboard API not supported here");
            }
            let comment = document.getElementById("comment");
            comment.style.opacity = 1;
            comment.textContent = "Copied!";
            setTimeout(() => {
                comment.style.opacity = 0;
            }, 1500);

        })
        demoBtn.addEventListener('click', () => {
            const link = `html/demo.html?data=${colorNameLink}`;
            window.location.href = link;
            console.log(`opening ${colorNameLink}`)
        })

        let stripes = color.colors;
        colorHover(stripes[2], stripes[1], stripes[0])
        stripes.forEach(stripe => {
            const stripeBox = document.createElement('div')
            let stripesName = document.createElement('div')
            stripeBox.classList.add('stripe')
            stripeBox.style.background = stripe
            stripesName.innerText = stripe
            stripesName.style.color = isColorDark(stripe) ? "white" : "black"
            stripeBox.appendChild(stripesName)
            stripesContainer.appendChild(stripeBox)

            stripeBox.addEventListener('click', () => {
                navigator.clipboard.writeText(`${stripe}`);
                let comment = document.getElementById("comment");
                comment.style.opacity = 1;
                comment.textContent = "Copied!";
                setTimeout(() => {
                    comment.style.opacity = 0;
                }, 1500);
            })
            stripeBox.addEventListener('mouseover', () => {
                colorName.style.color = isColorDark(stripe) ? "white" : "black";
                main.style.background = stripe
            })
            stripeBox.addEventListener('mouseleave', () => {
                colorName.style.color = "black";
                main.style.background = "rgb(255, 255, 255)"
            })

        })
        function colorHover(copyColor, demoColor, shadow) {
            copyBtn.style.backgroundColor = copyColor
            demoBtn.style.backgroundColor = demoColor
            copyBtn.style.boxShadow = `1px 1px 2px ${shadow}`
            demoBtn.style.boxShadow = `1px 1px 2px ${shadow}`
            copyBtn.style.color = isColorDark(copyColor) ? "white" : "black";
            demoBtn.style.color = isColorDark(demoColor) ? "white" : "black";
        }

        colorBox.setAttribute("id", colorNameLink);
        colorDetail.appendChild(colorName)
        colorBox.appendChild(stripesContainer)
        colorBox.appendChild(colorDetail)
        colorBox.appendChild(btns)

        colorContainer.appendChild(colorBox)
    })
}