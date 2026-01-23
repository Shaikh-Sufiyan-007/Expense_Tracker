import React, { useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useState } from 'react'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import Modal from '../../components/Modal'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import toast from 'react-hot-toast'

const Income = () => {
  const [incomeData, setIncomeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)

  // get all income data
  const fetchIncomeDetails = async() => {
    if(loading) return;

    setLoading(true)

    try {
      const res = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`)
      if(res.data) {
        setIncomeData(res.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Handle add income details
  const handleAddIncome = async(income) => {
    const { source, amount, date, icon } = income;

    if(!source.trim()) {
      toast.error("Income source is required")
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
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      })

      setOpenAddIncomeModal(false)
      toast.success("Income added successfully")
      fetchIncomeDetails()
    } catch (error) {
      console.log(error)
    }
  }

  // delete income
  const deletIncome = async() => {};

  // handle download income details
  const handleDownloadIncomeDetails = async() => {}

  useEffect(() => {
    fetchIncomeDetails()
  }, [])

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview 
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Income