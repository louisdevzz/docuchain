const Footer = () => {
    return(
        <div className="w-full border-t border-gray-200">
            <div className="p-10 flex flex-row justify-center items-center">
                <div className="py-6 ">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12">
                            <h2 className="font-manrope text-3xl md:text-4xl text-center font-bold text-gray-900 ">Nhóm chúng tôi</h2>
                        </div>
                        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 gap-8 md:gap-20 max-w-xl mx-auto md:max-w-3xl lg:max-w-full">
                                <div className="group group md:col-span-2 lg:col-span-1">
                                    <div className="relative mb-6">
                                        <img src="/assets/le_quoc_huy.jpg" alt="avatar"
                                            className="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-black" />
                                    </div>
                                    <h4
                                        className="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-black">
                                        Le Quoc Huy </h4>
                                    <span
                                        className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">Người hướng dẫn</span>
                                </div>
                                <div className="block group md:col-span-2 lg:col-span-1 ">
                                    <div className="relative mb-6">
                                        <img src="/assets/avatar.jpeg" alt="avatar"
                                            className="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-black" />
                                    </div>
                                    <h4
                                        className="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-black">
                                        Vo Huu Nhan
                                    </h4>
                                    <span
                                        className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">Người sáng lập</span>
                                </div>
                                <div className="block group min-[500px]:col-span-2 mx-auto md:col-span-2 lg:col-span-1 ">
                                    <div className="relative mb-6">
                                        <img src="https://pagedone.io/asset/uploads/1696238446.png" alt="Martin image"
                                            className="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-black" />
                                    </div>
                                    <h4
                                        className="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-black">
                                        Kim Long</h4>
                                    <span
                                        className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                                        Thành viên</span>
                                </div>
                        </div>
                    </div>
                </div>                                
            </div>
        </div>
    )
}

export default Footer;