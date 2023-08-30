import {useState} from "react"
function SubmitForm(){
    const [form, setForm] = useState({
        email: "",
        password: "",
        checkList: [],
    })
    function handleInput(e){
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleCheck = (e)=>{
        if(e.target.checked){ //如果勾選時
            setForm({
                ...form,
                [e.target.name]: [...form[e.target.name], e.target.value]
            })
        }else{ //沒有勾選時
            setForm({
                ...form,
                [e.target.name]: form[e.target.name].filter((item)=>{
                    return item !== e.target.value
                })
            })
        }
    }

    
    return(
        <>
            <div>
                <label htmlFor="email">Email{form.email}</label>
                <input type="email" id="email" name="email" onChange={handleInput}/>
            </div>
            <div>
                <label htmlFor="password">Password{form.password}</label>
                <input type="password" id="password" name="password" onChange={handleInput}/>
            </div>
            <div>
                多選 checkbox {form.checkList.toString()}
                <br />
                <input type="checkbox" id="check" value="卡斯柏" name="checkList" onChange={handleCheck}/>卡斯柏,
                <input type="checkbox" id="check" value="小名" name="checkList" onChange={handleCheck}/>小名,
                <input type="checkbox" id="check" value="杰倫" name="checkList" onChange={handleCheck}/>杰倫
            </div>
        </>
    )
}
export default SubmitForm;