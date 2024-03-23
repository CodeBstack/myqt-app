import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ValidatedInput from "@/components/ValidatedInput";
import ValidatedTextAreaField from "@/components/ValidatedTextAreaField";
import Button from "@/components/Button";
import axios from "axios";
import { useRouter } from "next/router";


const Questions = () => {
    const router = useRouter()
    const [token, setToken] = useState(null)

    // get token as soon as page renders
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem("token");
            if (!item) {
                router.push('/');
            } else {
                setToken(JSON.parse(item))
            }
        }
    }, [])

    // memoize token value so it doesn't clear on re render of this function component
    const authToken = useMemo(() => {
        return token;
    }, [token]);

    return (
        <div className="mt-6 w-full max-w-[40rem] mx-auto">
            <div className="w-full">
                <QuestionsTab authToken={authToken} />
            </div>

            <Button
                title={"Logout"}
                bg="bg-red-500"
                handleClick={() => {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem("token");
                    }
                    router.push("/")
                }}
            />
        </div>
    )
};

export default Questions;

const QuestionsTab = ({ authToken }) => {
    const [allQuestions, setallQuestions] = useState([])
    const [questionToEdit, setQuestionToEdit] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isCreatingQuestions, setIsCreatingQuestions] = useState(false)
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)


    const getQuestions = async () => {
        setIsLoadingQuestions(true)
        const url = 'https://qt.organogram.app/questions';

        try {
            const response = await axios.get(url, {
                headers: {
                    'Token': authToken,
                }
            });
            // console.log('Questions:', response.data);
            if (response.data) {
                setallQuestions(response.data)
            }
        } catch (error) {
            console.error('Error fetching questions:', error.message);
        }
        setIsLoadingQuestions(false)

    }

    // load question first time the page loads
    useEffect(() => {
        if (authToken) {
            getQuestions();
        }
    }, [authToken])

    const methodsEditing = useForm({
        mode: "all",
        defaultValues: {
            question: questionToEdit?.question,
            answer_1: questionToEdit?.options[0],
            answer_2: questionToEdit?.options[1],
            answer_3: questionToEdit?.options[2],
        }
    });

    useEffect(() => {
        methodsEditing.reset({
            question: questionToEdit?.question,
            answer_1: questionToEdit?.options[0],
            answer_2: questionToEdit?.options[1],
            answer_3: questionToEdit?.options[2],
        });
    }, [methodsEditing, questionToEdit, questionToEdit?.option, questionToEdit?.question]);


    const handleDelete = async (id) => {
        const url = `https://qt.organogram.app/questions/${id}`

        try {
            const response = await axios.delete(url, {
                headers: {
                    'Token': authToken
                }
            });
            alert('Question deleted successfully');
            getQuestions()
        } catch (error) {
            console.error('Error deleting question:', error.message);
        }
    };


    const onSubmitEditing = async (data) => {
        setIsCreatingQuestions(true)
        const url = 'https://qt.organogram.app/questions';
        const urlEditing = `https://qt.organogram.app/questions/${questionToEdit?.id}`

        const questionData = {
            question: data?.question,
            options: [
                data?.answer_1,
                data?.answer_2,
                data?.answer_3,
            ]
        };

        // edit question
        if (isEditing) {
            try {
                const response = await axios.put(urlEditing, questionData, {
                    headers: {
                        'Token': authToken,
                        'Content-Type': 'application/json'
                    }
                });
                setIsEditing(false)
                methodsEditing.reset({
                    question: "",
                    answer_1: "",
                    answer_2: "",
                    answer_3: "",
                })
                getQuestions()
                setIsCreatingQuestions(false)
                alert('Question updated successfully');
            } catch (error) {
                console.error('Error creating question:', error.message);
            }
        }
        // add question
        else {
            try {
                const response = await axios.post(url, questionData, {
                    headers: {
                        'Token': authToken,
                        'Content-Type': 'application/json'
                    }
                });
                methodsEditing.reset({
                    question: "",
                    answer_1: "",
                    answer_2: "",
                    answer_3: "",
                })
                getQuestions()
                setIsCreatingQuestions(false)
                alert('Question created successfully');
            } catch (error) {
                console.error('Error creating question:', error.message);
            }
        }
    }

    const refElement = useRef(null);

    const scrollToRef = () => {
        if (refElement.current) {
            refElement.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const arrayOfObjects = Object.entries(allQuestions).map(([key, value]) => ({ id: key, ...value }));

    return (
        <main ref={refElement} className="">
            <div className="flex justify-end">

            </div>
            <div className="flex items-center justify-between my-8">
                <span className="flex text-xl gap-4 items-center text-neutral-07 font-semibold">
                    General (Questions & Answers)
                </span>

            </div>

            <FormProvider {...methodsEditing}>
                <form
                    className="flex flex-col gap-y-8 w-full"
                    onSubmit={methodsEditing.handleSubmit(onSubmitEditing)}
                >
                    <ValidatedTextAreaField
                        name={"question"}
                        label="Add Question"
                    />
                    <ValidatedInput
                        name={"answer_1"}
                        label="Answer 1"
                    />

                    <ValidatedInput
                        name={"answer_2"}
                        label="Answer 2"
                    />

                    <ValidatedInput
                        name={"answer_3"}
                        label="Answer 3"
                    />
                    
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: "8px",
                            backgroundColor: "#1E1E1E",
                            borderRadius: "12px !important",
                            maxWidth: "76px",
                            color: "#fff",
                        }}
                        title={isCreatingQuestions ? "Loading..." : isEditing ? "Update" : "Save"}
                    />

                </form>
            </FormProvider>

            <div className="mt-12">
                {isLoadingQuestions
                    ? <p className="py-10 text-gray-800 font-semibold">Loading...</p>
                    : arrayOfObjects?.map((answer, index) => (
                        <AnswerBox
                            key={answer?.id}
                            handleDelete={() => handleDelete(answer?.id)}
                            handleEdit={() => {
                                setQuestionToEdit(answer)
                                scrollToRef()
                                setIsEditing(true)
                            }}
                            question={answer?.question}
                            options={answer?.options}
                            index={index}
                        />
                    ))}
            </div>



        </main>
    );
};

const AnswerBox = ({
    index,
    question,
    options,
    handleDelete,
    handleEdit,
}) => {

    return (
        <div className="p-30 bg-[#F4F4F4] rounded-[20px] mb-6">
            <div className="flex items-center justify-between mb-8">
                <span className="flex gap-4 items-center text-neutral-07 font-semibold text-xl">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="17.5" cy="17.5" r="17.5" fill="#bfb1b5" />
                        <path d="M17.5 5C15.0277 5 12.611 5.73311 10.5554 7.10663C8.49976 8.48015 6.89761 10.4324 5.95151 12.7165C5.00542 15.0005 4.75787 17.5139 5.24019 19.9386C5.7225 22.3634 6.91301 24.5907 8.66117 26.3388C10.4093 28.087 12.6366 29.2775 15.0614 29.7598C17.4861 30.2421 19.9995 29.9946 22.2835 29.0485C24.5676 28.1024 26.5199 26.5002 27.8934 24.4446C29.2669 22.389 30 19.9723 30 17.5C29.9965 14.1859 28.6784 11.0085 26.335 8.66503C23.9915 6.32158 20.8141 5.0035 17.5 5ZM17.5 25.1923C17.2147 25.1923 16.9359 25.1077 16.6987 24.9492C16.4615 24.7907 16.2766 24.5655 16.1675 24.3019C16.0583 24.0384 16.0298 23.7484 16.0854 23.4686C16.1411 23.1888 16.2784 22.9318 16.4801 22.7301C16.6818 22.5284 16.9388 22.3911 17.2186 22.3354C17.4984 22.2798 17.7884 22.3083 18.0519 22.4175C18.3155 22.5266 18.5408 22.7115 18.6992 22.9487C18.8577 23.1859 18.9423 23.4647 18.9423 23.75C18.9423 24.1325 18.7904 24.4994 18.5199 24.7699C18.2494 25.0403 17.8825 25.1923 17.5 25.1923ZM18.4615 19.3365V19.4231C18.4615 19.6781 18.3602 19.9227 18.1799 20.103C17.9996 20.2833 17.755 20.3846 17.5 20.3846C17.245 20.3846 17.0004 20.2833 16.8201 20.103C16.6398 19.9227 16.5385 19.6781 16.5385 19.4231V18.4615C16.5385 18.2065 16.6398 17.9619 16.8201 17.7816C17.0004 17.6013 17.245 17.5 17.5 17.5C19.0901 17.5 20.3846 16.4183 20.3846 15.0962C20.3846 13.774 19.0901 12.6923 17.5 12.6923C15.9099 12.6923 14.6154 13.774 14.6154 15.0962V15.5769C14.6154 15.8319 14.5141 16.0765 14.3338 16.2568C14.1534 16.4372 13.9089 16.5385 13.6538 16.5385C13.3988 16.5385 13.1543 16.4372 12.9739 16.2568C12.7936 16.0765 12.6923 15.8319 12.6923 15.5769V15.0962C12.6923 12.7103 14.8486 10.7692 17.5 10.7692C20.1514 10.7692 22.3077 12.7103 22.3077 15.0962C22.3077 17.1851 20.6538 18.9339 18.4615 19.3365Z" fill="white" />
                    </svg>

                    Question {index + 1}
                </span>
                <div className="flex items-center justify-between gap-x-3.5">
                    <Button
                        title={"Edit"}
                        variant="contained"
                        handleClick={handleEdit}
                        sx={{
                            backgroundColor: "#1E1E1E",
                            borderRadius: "12px !important",
                            maxWidth: "106px",
                            color: "#FFFFFF",
                        }}
                        size="small"
                        icon={
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M14.5357 3.80739C15.7073 2.63582 17.6067 2.63582 18.7783 3.80739L20.1925 5.2216C21.3641 6.39318 21.3641 8.29267 20.1925 9.46424L9.80003 19.8568C9.66043 19.9964 9.48263 20.0915 9.28904 20.1302L3.98573 21.1909C3.28601 21.3308 2.66909 20.7139 2.80904 20.0142L3.8697 14.7109C3.90842 14.5173 4.00357 14.3395 4.14317 14.1999L14.5357 3.80739ZM17.3641 5.2216L18.7783 6.63582C19.1688 7.02634 19.1688 7.65951 18.7783 8.05003L17.3641 9.46425L14.5357 6.63582L15.9499 5.2216C16.3404 4.83108 16.9736 4.83108 17.3641 5.2216ZM13.1215 8.05003L5.77148 15.4L5.06437 18.9356L8.59991 18.2284L15.9499 10.8785L13.1215 8.05003Z"
                                    fill="white"
                                />
                            </svg>
                        }
                    >
                        Edit
                    </Button>
                    <button
                        onClick={handleDelete}
                        className="bg-white rounded-full w-10 h-10 flex justify-center items-center"
                    >
                        <DeleteIcon />
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-y-[10px]">
                <div className="py-4 px-[20px] rounded-[20px] bg-white">
                    <p className="text-neutral-04 text-sm font-semibold">{question}?</p>
                </div>

                {options?.map((option, i) =>
                    <div key={option?.id} className="p-[20px] rounded-[20px] flex items-center gap-x-2 bg-white">
                        <BookIcon />

                        <p className="text-neutral-04 text-sm font-semibold">Ans {i + 1}. {option?.charAt(0)?.toUpperCase() + option.slice(1)}.</p>
                    </div>
                )}

            </div>
        </div>
    );
};


const BookIcon = () =>
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.16675 3.3335C2.78604 3.3335 1.66675 4.45278 1.66675 5.8335V14.1668C1.66675 15.5475 2.78604 16.6668 4.16675 16.6668H6.68869C7.2261 16.6668 7.76 16.7535 8.26983 16.9234L9.68385 17.3948C9.88912 17.4632 10.111 17.4632 10.3163 17.3948L11.7303 16.9234C12.2402 16.7535 12.7741 16.6668 13.3115 16.6668H15.8334C17.2141 16.6668 18.3334 15.5475 18.3334 14.1668V5.8335C18.3334 4.45278 17.2141 3.3335 15.8334 3.3335H12.5001C11.6064 3.3335 10.7948 3.68521 10.1963 4.25777C10.0876 4.36173 9.91258 4.36173 9.8039 4.25777C9.20535 3.68521 8.39379 3.3335 7.50008 3.3335H4.16675ZM10.8334 15.4656L11.2033 15.3423C11.8831 15.1157 12.5949 15.0002 13.3115 15.0002H15.8334C16.2937 15.0002 16.6667 14.6271 16.6667 14.1668V5.8335C16.6667 5.37326 16.2937 5.00016 15.8334 5.00016H12.5001C11.5796 5.00016 10.8334 5.74636 10.8334 6.66683V15.4656Z"
            fill="#6F767E"
        />
    </svg>

function DeleteIcon() {
    return (<svg
        width="18"
        height="18"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M18.75 5H25V7.5H22.5V23.75C22.5 24.0815 22.3683 24.3995 22.1339 24.6339C21.8995 24.8683 21.5815 25 21.25 25H3.75C3.41848 25 3.10054 24.8683 2.86612 24.6339C2.6317 24.3995 2.5 24.0815 2.5 23.75V7.5H0V5H6.25V1.25C6.25 0.918479 6.3817 0.600537 6.61612 0.366116C6.85054 0.131696 7.16848 0 7.5 0H17.5C17.8315 0 18.1495 0.131696 18.3839 0.366116C18.6183 0.600537 18.75 0.918479 18.75 1.25V5ZM20 7.5H5V22.5H20V7.5ZM14.2675 15L16.4775 17.21L14.71 18.9775L12.5 16.7675L10.29 18.9775L8.5225 17.21L10.7325 15L8.5225 12.79L10.29 11.0225L12.5 13.2325L14.71 11.0225L16.4775 12.79L14.2675 15ZM8.75 2.5V5H16.25V2.5H8.75Z"
            fill="#FF6A55"
        />
    </svg>)
}