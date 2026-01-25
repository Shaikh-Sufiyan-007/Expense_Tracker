import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import Modal from '../../components/Modal';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([])
    const [loading, setLoading] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null
    })
  
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false)

    // get all expense data
  const fetchExpenseDetails = async() => {
    if(loading) return;

    setLoading(true)

    try {
      const res = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`)
      if(res.data) {
        setExpenseData(res.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Handle add income details
  const handleAddExpense = async(expense) => {
    const { category, amount, date, icon } = expense;

    if(!category.trim()) {
      toast.error("Category source is required")
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Invalid amount")
      return;
    }

    if(!date) {
      toast.error("Date is required")
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      })

      setOpenAddExpenseModal(false)
      toast.success("Income added successfully")
      fetchExpenseDetails()
    } catch (error) {
      console.log(error)
    }
  };

    // delete expense  
  const deletExpense = async(id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))

      setOpenDeleteAlert({ show: false, data: null })
      toast.success("Expense deleted successfully")
      fetchExpenseDetails()
    } catch (error) {
      console.log(error)
    }
  };

  // handle download expense details
  const handleDownloadExpenseDetails = async() => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error)
      toast.error("Failed to download expense details")
    }
  }

  useEffect(() => {
    fetchExpenseDetails()

    return () => {}
  }, [])

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList 
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({show: true, data: id})
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, date: null })}
          title="Delete Expense"
          
        >
          <DeleteAlert 
            content="Are you sure you want to delete this Expense?"
            onDelete={() => deletExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense