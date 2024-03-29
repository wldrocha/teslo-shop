import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getOrderById } from '@/actions'
import { OrderStatus, PaypalButton, ProductImage, Title } from '@/components'
import { currencyFormat } from '@/utils'

interface Props {
  params: {
    id: string
  }
}

export default async function OrderParticularPage({ params }: Props) {
  const { id } = params

  // todo call to server action
  const { ok, order } = await getOrderById(id)

  if (!ok) {
    redirect('/')
  }

  return (
    <div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title={`Order # ${id.split('-').at(-1)}`} />
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
          {/* cart */}
          <div className='flex flex-col mt-5'>
            <OrderStatus isPaid={order?.isPaid ?? false} />

            {/* Items */}
            {order?.OrderItem?.map((item) => (
              <div key={item.product.slug} className='flex mb-5'>
                <ProductImage
                  src={item.product.ProductImage[0].url}
                  width={100}
                  height={100}
                  alt={item.product.slug}
                  className='mr-5 rounded'
                />
                <div>
                  <p>{item.product.name}</p>
                  <p>
                    {currencyFormat(item.price)} x {item.quantity}
                  </p>
                  <p>Subtotal: {currencyFormat(item.price * item.quantity)}</p>
                  {/* <button className='underline'>Remove</button> */}
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className='bg-white rounded-xl shadow-xl p-7'>
            <h2 className='text-2xl mb-2'>Address shipping</h2>
            <div className='mb-5'>
              <p>
                {order?.orderAddress?.firstName} {order?.orderAddress?.lastName}
              </p>
              <p>{order?.orderAddress?.address}</p>
              <p>{order?.orderAddress?.address2}</p>
              <p>{order?.orderAddress?.zip}</p>
              <p>
                {order?.orderAddress?.city} {order?.orderAddress?.country?.name}
              </p>
              <p>{order?.orderAddress?.phone}</p>
            </div>
            <hr className='w-full h-0.5 rounded bg-gray-200 mb-5' />
            <h2 className='text-2xl mb-2'>Resume</h2>
            <div className='grid grid-cols-2'>
              <span>Products quantity</span>
              <span className='text-right'>
                {order?.itemsInOrder === 1 ? '1 article' : `${order?.itemsInOrder} articles`}
              </span>
              <span>Subtotal</span>
              <span className='text-right'>{currencyFormat(order!.subTotal)}</span>
              <span>Impuestos (15%)</span>
              <span className='text-right'>{currencyFormat(order!.tax)}</span>
              <span className='mt-5 text-2xl '>Total</span>
              <span className='mt-5 text-2xl text-right'>{currencyFormat(order!.total)}</span>
            </div>

            <div className='mt-5 mb-2 w-full'>
              {order?.isPaid ? (
                <OrderStatus isPaid={order.isPaid} />
              ) : (
                <PaypalButton amount={order!.total} orderId={order!.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
