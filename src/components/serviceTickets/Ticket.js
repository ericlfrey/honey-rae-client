import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { isStaff } from "../../utils/isStaff"
import { getAllEmployees } from "../../managers/EmployeeManager"
import { getTicketById, deleteTicket, updateTicket } from "../../managers/TicketManager"
import { ticketStatus } from "../../utils/ticketStatus"

export const Ticket = () => {
  const [ticket, setTicket] = useState({})
  const [employees, setEmployees] = useState([])
  const { ticketId } = useParams()
  const navigate = useNavigate()

  const fetchTicket = () => {
    getTicketById(ticketId)
      .then((res) => setTicket(res))
  }

  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  useEffect(
    () => {
      getAllEmployees().then((res) => setEmployees(res))
    }, []
  )

  const deleteTicketEvent = () => {
    deleteTicket(ticketId).then(() => navigate("/"))
  }

  const updateTicketEvent = (evt) => {
    const updatedTicket = {
      ...ticket,
      employee: parseInt(evt.target.value)
    }

    updateTicket(updatedTicket).then(() => fetchTicket())
  }

  const closeTicket = (evt) => {
    const updatedTicket = {
      ...ticket,
      date_completed: evt.target.value
    }
    console.log(updatedTicket);
  }

  const employeePicker = () => {
    if (isStaff()) {
      return <div className="ticket__employee">
        <label>Assign to:</label>
        <select
          value={ticket.employee?.id}
          onChange={updateTicketEvent}>
          <option value="0">Choose...</option>
          {
            employees.map(e => <option key={`employee--${e.id}`} value={e.id}>{e.full_name}</option>)
          }
        </select>
      </div>
    }
    else {
      return <div className="ticket__employee">Assigned to {ticket.employee?.full_name ?? "no one"}</div>
    }
  }

  return (
    <>
      <section className="ticket">
        <h3 className="ticket__description">Description</h3>
        <div>{ticket.description}</div>

        <footer className="ticket__footer ticket__footer--detail">
          <div className=" footerItem">Submitted by {ticket.customer?.full_name}</div>
          <div className="ticket__employee footerItem">
            {
              ticket.date_completed === null
                ? employeePicker()
                : `Completed by ${ticket.employee?.full_name} on ${ticket.date_completed}`
            }
          </div>
          <div className="footerItem">
            {ticketStatus(ticket)}
          </div>
          {
            isStaff()
              ? ticket.date_completed === null
                ? <button type="button" onClick={closeTicket}> Mark Done</button>
                : <></>
              : <button onClick={deleteTicketEvent}>Delete</button>
          }
        </footer>

      </section>
    </>
  )
}
