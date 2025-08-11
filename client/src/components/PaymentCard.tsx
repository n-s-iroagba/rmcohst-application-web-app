import { Payment } from "@/types/payment"

const PaymentCard:React.FC<{payment:Payment}> = ({payment})=>{
    return<div>

        <div>Payment Status:{payment.status}</div>
    </div>
}