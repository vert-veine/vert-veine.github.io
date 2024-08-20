// ........................................... colors ...............................................
let selectedColor = 0
const colors = ["blue", "red", "green", "purple"]
const color_events = { blue: "#779ECB", red: "#FE6B64", green: "#5FD885", purple: "#B29DD9" }

const getColoredSquareElement = (da_color) => {
    let rslt_color = 0
    for (const [i, c] of Object.values(color_events).entries()) {
        if (c == da_color) {
            rslt_color = i
            break
        }
    }
    return rslt_color
}

const getColor = (i) => {
    if (i >= 0 && i < 4)
        return color_events[colors[i]]
    return color_events.blue
}

const select_color = (c) => {
    for (let i = 0; i < colors.length; i++) {
        const css_v = (i == c) ? "5px" : "0px"
        document.getElementById('rect_' + colors[i]).style.border = "solid #000 " + css_v
    }
    selectedColor = c
}
// ..................................................................................................


function my_addEvent(calEvent) {
    if (calEvent.id) {
        ec.updateEvent(calEvent);
        return;
    }
    calEvent.id = new Date().getTime();

    ec.addEvent(calEvent);
    ec.unselect();
}

document.getElementById('cancel').onclick = function () {
    dialog_calE.close();
};

// Récupération de l'evt à partir des données de la fenêtre modale
document.getElementById('form_e').onsubmit = function (e) {
    e.preventDefault();

    // On récupère cet ev global
    const calEvt = dialog_calE.event;

    const startTime = document.getElementById('start').value.split(':');
    calEvt.start.setHours(Number(startTime[0]));
    calEvt.start.setMinutes(Number(startTime[1]));

    const endTime = document.getElementById('end').value.split(':');
    calEvt.end.setHours(Number(endTime[0]));
    calEvt.end.setMinutes(Number(endTime[1]));

    const comment = document.getElementById('comment').value;
    calEvt.title = comment;

    const num_cal = document.querySelector('input[name="radio_cal"]:checked').value;
    calEvt.resourceIds = [num_cal] // tous les cas, un evt appartient à plusieurs calendrier plus tard

    calEvt.backgroundColor = getColor(selectedColor)

    my_addEvent(calEvt);
    dialog_calE.close();
}

// Affiche un calEvent dans la fenêtre modale
function show__Modal(calEvent) {
    // TODO
    function getResourceTitle(event) {
        const resourceId = event.resourceIds ? event.resourceIds[0] : 1;
        return resourceId
    }
    const startDate = dayjs(calEvent.start);
    const jour_semaine = new Intl.DateTimeFormat('fr', { weekday: 'long' }).format(startDate)
    const da_date = new Intl.DateTimeFormat('fr', { weekdayday: 'long' }).format(startDate)
    document.getElementById('date').innerText = jour_semaine + " " + da_date
    document.getElementById('start').value = startDate.format('HH:mm');
    document.getElementById('end').value = dayjs(calEvent.end).format('HH:mm');
    document.getElementById('comment').value = calEvent.title || '';
    const ce = getColoredSquareElement(calEvent.backgroundColor) // TODO : récuper from CSS
    select_color(ce)

    const cal_num = getResourceTitle(calEvent)
    document.getElementById('radio' + cal_num).checked = true;

    // On affecte l'ev en cours en var globale
    dialog_calE.event = calEvent;
    dialog_calE.showModal();
}